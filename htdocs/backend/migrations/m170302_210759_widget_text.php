<?php

use yii\db\Schema;
use yii\db\Migration;

class m170302_210759_widget_text extends Migration
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
            '{{%widget_text}}',
            [
                'id'=> $this->primaryKey(11),
                'key'=> $this->string(255)->notNull(),
                'title'=> $this->string(255)->notNull(),
                'body'=> $this->text()->notNull(),
                'status'=> $this->smallInteger(6)->null()->defaultValue(null),
                'created_at'=> $this->integer(11)->null()->defaultValue(null),
                'updated_at'=> $this->integer(11)->null()->defaultValue(null),
            ],$tableOptions
        );
        $this->createIndex('idx_widget_text_key','{{%widget_text}}','key',false);
    }

    public function safeDown()
    {
        $this->dropIndex('idx_widget_text_key', '{{%widget_text}}');
        $this->dropTable('{{%widget_text}}');
    }
}
