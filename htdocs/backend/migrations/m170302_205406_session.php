<?php

use yii\db\Schema;
use yii\db\Migration;

class m170302_205406_session extends Migration
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
            '{{%session}}',
            [
                'id'=> $this->char(40)->notNull(),
                'expire'=> $this->integer(11)->null()->defaultValue(null),
                'data'=> $this->binary()->null()->defaultValue(null),
                'user_id'=> $this->integer(11)->null()->defaultValue(null),
                'last_write'=> $this->timestamp()->null()->defaultExpression("CURRENT_TIMESTAMP"),
            ],$tableOptions
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%session}}');
    }
}
