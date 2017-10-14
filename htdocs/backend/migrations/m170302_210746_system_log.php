<?php

use yii\db\Schema;
use yii\db\Migration;

class m170302_210746_system_log extends Migration
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
            '{{%system_log}}',
            [
                'id'=> $this->bigPrimaryKey(20),
                'level'=> $this->integer(11)->null()->defaultValue(null),
                'category'=> $this->string(255)->null()->defaultValue(null),
                'log_time'=> $this->double()->null()->defaultValue(null),
                'prefix'=> $this->text()->null()->defaultValue(null),
                'message'=> $this->text()->null()->defaultValue(null),
            ],$tableOptions
        );
        $this->createIndex('idx_log_level','{{%system_log}}','level',false);
        $this->createIndex('idx_log_category','{{%system_log}}','category',false);
    }

    public function safeDown()
    {
        $this->dropIndex('idx_log_level', '{{%system_log}}');
        $this->dropIndex('idx_log_category', '{{%system_log}}');
        $this->dropTable('{{%system_log}}');
    }
}
