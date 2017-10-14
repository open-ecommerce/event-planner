<?php

use yii\db\Schema;
use yii\db\Migration;

class m170302_210748_timeline_event extends Migration
{

    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $tableOptions = 'ENGINE=InnoDB';

        $this->createTable(
            '{{%timeline_event}}',
            [
                'id'=> $this->primaryKey(11),
                'application'=> $this->string(64)->notNull(),
                'category'=> $this->string(64)->notNull(),
                'event'=> $this->string(64)->notNull(),
                'data'=> $this->text()->null()->defaultValue(null),
                'created_at'=> $this->integer(11)->notNull(),
            ],$tableOptions
        );
        $this->createIndex('idx_created_at','{{%timeline_event}}','created_at',false);
    }

    public function safeDown()
    {
        $this->dropIndex('idx_created_at', '{{%timeline_event}}');
        $this->dropTable('{{%timeline_event}}');
    }
}
